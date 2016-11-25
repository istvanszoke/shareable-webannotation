using AnnotateWebPageBackend.EntitiyDataModels;
using AnnotateWebPageBackend.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using static AnnotateWebPageBackend.Models.HighlightModels;

namespace AnnotateWebPageBackend.Controllers
{
    [EnableCors(origins: "chrome-extension://apofblllkmfcblkkfppcbfaoapcjjlkn", headers: "*", methods: "*")]
    public class HighlightsController : ApiController
    {

        HighlightModels highlightModels = new HighlightModels();
        public IEnumerable<HighlightModel> Get()
        {            
            return highlightModels.GetHighlights();
        }

        // GET: api/Highlights/5
        [Route("api/Highlights/{id}", Name = "GetHighlightUrl")]
        public IHttpActionResult Get(int id)
        {
            var highlight = highlightModels.GetHighlight(id);
            if (highlight == null)
            {
                return NotFound();
            }
            return Ok(highlight);
        }

        [Route("api/Highlights/byUserAndUrl")]
        public IHttpActionResult Get([FromUri] string userId, [FromUri]  string url)
        {
            var highlights = highlightModels.GetHighlight(userId, url);
            return Ok(highlights);
        }


        public IHttpActionResult Post([FromBody]HighlightModel Highlight)
        {
            //if (Highlight.id == 0) //insert
            //{
                var insertedHighlight = highlightModels.InsertHighlight(Highlight);

                if (insertedHighlight != null)
                {
                    return Created(
                        Url.Link("GetHighlightUrl", new { id = insertedHighlight.id }),
                        insertedHighlight);
                }
                else
                    return BadRequest();
            //}

            //return BadRequest();
        }

        [Route("api/Highlights/{id}", Name = "DeleteHighlight")]
        public IHttpActionResult Delete(int id)
        {
            if (highlightModels.DeleteHighlight(id))
                return Ok();
            return BadRequest();
        }


    }
}
