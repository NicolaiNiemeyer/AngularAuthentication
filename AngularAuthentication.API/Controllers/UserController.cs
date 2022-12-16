using AngularAuthentication.API.Context;
using AngularAuthentication.API.Models;
using AngularAuthentication.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace AngularAuthentication.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UserController : ControllerBase
  {
    private readonly ApiDbContext dbContext;
    // Inject dbcontext in constructor to communicate with the db
    public UserController(ApiDbContext dbContext)
    {
      this.dbContext = dbContext;
    }

    // "authenticate" is the route
    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] User userObj )
    {
      if (userObj == null)
        return BadRequest();  //throws 400 error

      //check if user is already in db
      var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username);
      if (user == null)
        return NotFound(new { Message = "User Not Found!" });

      //Verify password
      if(!PasswordHashService.VerifyPassword(userObj.Password, user.Password))
      {
        return BadRequest(new { Message = "Password is incorrect" });
      }

      user.Token = CreateJwt(user);

      return Ok(new
      {
        //send token to front-end
        Token = user.Token,
        Message = "Login Success!"
      });
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] User userObj)
    {
      if(userObj  == null)
        return BadRequest();

      //Check username
      if(await CheckUsernameExistAsync(userObj.Username))
        return BadRequest(new { Message = "Username already exists"});

      //Check password strength
      var pass = CheckPasswordStrength(userObj.Password);
      if (!string.IsNullOrEmpty(pass))
        return BadRequest(new { Message = pass.ToString() });

      //hash password before saving user to db
      userObj.Password = PasswordHashService.HashPassword(userObj.Password);
      //user role obj
      //userObj.Role = "User";
      //json web token obj
      userObj.Token = "";

      //add user to db
      await dbContext.Users.AddAsync(userObj);
      await dbContext.SaveChangesAsync();
      return Ok(new
      {
        Message = "User Registered!"
      });
    }

    
    

    private Task<bool> CheckUsernameExistAsync(string username) => dbContext.Users.AnyAsync(x => x.Username == username);

    private string CheckPasswordStrength(string password)
    {
      StringBuilder sb = new StringBuilder();
      //Check for password length
      if(password.Length < 6)
        sb.Append("minimum password is 6" + Environment.NewLine);

      //Check for numbers and letters
      if(!(Regex.IsMatch(password, "[a-z]")
        && Regex.IsMatch(password, "[A-Z]")
        && Regex.IsMatch(password, "[0-9]")))
        sb.Append("Password should be alphanumeric" + Environment.NewLine);

      //Check for special characters
      if (!Regex.IsMatch(password, "[!,@,£,$]"))
        sb.Append("Password should contain special characters" + Environment.NewLine);
      return sb.ToString();

    }

    private string CreateJwt(User user)
    {
      var jwtTokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes("secret json web token key.....");  //the key must be at least 16 characters in length, when using ASCII UTF8.
      var identity = new ClaimsIdentity(new Claim[]
      {
        new Claim(ClaimTypes.Name, $"{user.Username}"),
      });
      var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = identity,
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = credentials,
      };
      var token = jwtTokenHandler.CreateToken(tokenDescriptor);
      return jwtTokenHandler.WriteToken(token);   //returns encrypted token

    }

    //Api call to check for user authentication before sending resource to front-end.
    /*[Authorize]*/   //protects the API by preventing unauthorized access to this method and get a list of all users.
    [HttpGet]
    public async Task<ActionResult<User>> GetAllUsers()
    {
      //list of all users that have registered
      return Ok(await dbContext.Users.ToListAsync());
    }
  }
}
