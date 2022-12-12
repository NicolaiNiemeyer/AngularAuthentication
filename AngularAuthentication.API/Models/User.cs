using System.ComponentModel.DataAnnotations;

namespace AngularAuthentication.API.Models
{
  public class User
  {
    [Key]
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Token { get; set; }
  }
}
