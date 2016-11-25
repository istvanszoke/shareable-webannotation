using AnnotateWebPageBackend.EntitiyDataModels;
using AnnotateWebPageBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using static AnnotateWebPageBackend.Models.CommentModels;

namespace AnnotateWebPageBackend.Controllers
{
    [EnableCors(origins: "chrome-extension://apofblllkmfcblkkfppcbfaoapcjjlkn", headers: "*", methods: "*")]
    public class CommentsController : ApiController
    {
        CommentModels commentModels = new CommentModels();

        public IEnumerable<CommentModel> Get()
        {
            return commentModels.GetComments();
        }

        [Route("api/Comments/{id}", Name = "GetCommentUrl")]
        public IHttpActionResult Get(int id)
        {
            var comment = commentModels.GetComment(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        [Route("api/Comments/byUserAndUrl")]
        public IHttpActionResult Get([FromUri] string userId, [FromUri]  string url)
        {
            var comments = commentModels.GetComment(userId, url);
            return Ok(comments);
        }

        public IHttpActionResult Post([FromBody]CommentModel comment)
        {
            var insertedComment = commentModels.InsertComment(comment);

            if (insertedComment != null)
            {
                return Created(
                    Url.Link("GetCommentUrl", new { id = insertedComment.id }),
                    insertedComment);
            }
            else
                return BadRequest();
        }

        [Route("api/Comments/{id}", Name = "UpdateCommentUrl")]
        public IHttpActionResult Put(int id, [FromBody] CommentModel comment)
        {
            if (commentModels.UpdateComment(id, comment))
                return Ok();
            return NotFound();
        }

        [Route("api/Comments/{id}", Name = "DeleteCommentUrl")]
        public IHttpActionResult Delete(int id)
        {
            if (commentModels.DeleteComment(id))
                return Ok();
            return BadRequest();
        }
    }
}
