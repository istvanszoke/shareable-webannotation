using AnnotateWebPageBackend.EntitiyDataModels;
using AnnotateWebPageBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace AnnotateWebPageBackend.Controllers
{
    [EnableCors(origins: "chrome-extension://apofblllkmfcblkkfppcbfaoapcjjlkn", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        UserModels userModels = new UserModels();
        public IEnumerable<User> Get()
        {            
            return userModels.GetUsers();
        }

        // GET: api/Users/5
        [Route("api/Users/{id}", Name = "GetUserUrl")]
        public IHttpActionResult Get(string id)
        {
            var user = userModels.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user.name);
        }

        public IHttpActionResult Post([FromBody]User user)
        {
            var insertedUser = userModels.InsertUser(user);

            if (insertedUser != null)
            {
                return Created(
                    Url.Link("GetUserUrl", new { id = insertedUser.id }),
                    insertedUser);
            }
            else
                return BadRequest();
        }
    }
}
