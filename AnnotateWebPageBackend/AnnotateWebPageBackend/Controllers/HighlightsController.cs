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


        public IHttpActionResult Post([FromBody]Highlight Highlight)
        {
            if (Highlight.id == 0) //insert
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
            else if (Highlight.id == -1) //query
            {
                var highlights = HighlightModels.GetHighlightsByUserAndUrl(Highlight.user_id, Highlight.web_page);

                if (highlights == null)
                {
                    return NotFound();
                }

                List<RawHighlight> raws = new List<RawHighlight>();
                foreach (var item in highlights)
                {
                    raws.Add(convertToRaw(item));
                }

                var json = JsonConvert.SerializeObject(raws);
                return Ok(json);
            }

            return BadRequest();
        }

        [Route("api/Highlights/{id}", Name = "DeleteHighlight")]
        public IHttpActionResult Delete(int id)
        {
            if (HighlightModels.deleteHighlight(id))
                return Ok();
            return BadRequest();
        }

        private RawHighlight convertToRaw(Highlight hg)
        {
            RawHighlight raw = new RawHighlight();
            raw.id = hg.id;
            raw.user_id = hg.user_id;
            raw.web_page = hg.web_page;
            raw.start = hg.start;
            raw.end = hg.end;

            return raw;
        }

        class RawHighlight
        {

            public int id { get; set; }

            public string user_id { get; set; }

            public string web_page { get; set; }

            public string start { get; set; }

            public string end { get; set; }
        }
    }
}
