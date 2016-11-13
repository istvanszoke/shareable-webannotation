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

namespace AnnotateWebPageBackend.Controllers
{
    [EnableCors(origins: "chrome-extension://apofblllkmfcblkkfppcbfaoapcjjlkn", headers: "*", methods: "*")]
    public class HighlightsController : ApiController
    {
        HighlightModels HighlightModels = new HighlightModels();
        public IEnumerable<Highlight> Get()
        {            
            return HighlightModels.GetHighlights();
        }

        // GET: api/Highlights/5
        [Route("api/Highlights/{id}", Name = "GetHighlightUrl")]
        public IHttpActionResult Get(int id)
        {
            var Highlight = HighlightModels.GetHighlight(id);
            if (Highlight == null)
            {
                return NotFound();
            }
            return Ok(Highlight);
        }
        
        [Route("api/Highlights/User/{id}/{url}", Name = "GetHighlightsByUser")]
        public IHttpActionResult GetHighlightsByUserAndUrl(string id, string url)
        {
            var highlights = HighlightModels.GetHighlightsByUserAndUrl(id, url);
            
            if (highlights == null)
            {
                return NotFound();
            }
            var json = JsonConvert.SerializeObject(highlights);
            return Ok(json);
        }


        public IHttpActionResult Post([FromBody]Highlight Highlight)
        {
            var insertedHighlight = HighlightModels.InsertHighlight(Highlight);

            if (insertedHighlight != null)
            {
                return Created(
                    Url.Link("GetHighlightUrl", new { id = insertedHighlight.id }),
                    insertedHighlight);
            }
            else
                return BadRequest();
        }
    }
}
