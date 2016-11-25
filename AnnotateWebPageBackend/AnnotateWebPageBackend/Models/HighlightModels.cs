using AnnotateWebPageBackend.EntitiyDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnnotateWebPageBackend.Models
{
    public class HighlightModels
    {
        public class HighlightModel
        {
            public int id { get; set; }

            public string user_id { get; set; }

            public string web_page { get; set; }

            public string start { get; set; }

            public string end { get; set; }

            public string color { get; set; }
        }
        public IEnumerable<HighlightModel> GetHighlights()
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    List<HighlightModel> highlights = new List<HighlightModel>();
                    foreach (var highlight in db.Highlight)
                    {
                        highlights.Add(new HighlightModel() { id = highlight.id, user_id = highlight.user_id, web_page = highlight.web_page, start = highlight.start, end = highlight.end, color = highlight.color });
                    }
                    return highlights;
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public HighlightModel GetHighlight(int id)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    foreach (var highlight in db.Highlight)
                    {
                        if (highlight.id == id) return new HighlightModel() { id = highlight.id, user_id = highlight.user_id, web_page = highlight.web_page, start = highlight.start, end = highlight.end, color = highlight.color };
                    }

                    return null;
                }

            }
            catch (Exception)
            {
                throw;
            }

        }

        public List<HighlightModel> GetHighlight(string userId, string url)
        {
            using (var db = new AnnotateWebPageDBEntities())
            {
                List<HighlightModel> highlights = new List<HighlightModel>();
                foreach (var highlight in db.Highlight)
                {
                    if (highlight.user_id.Equals(userId) && highlight.web_page.Equals(url))
                        highlights.Add(new HighlightModel() { id = highlight.id, user_id = highlight.user_id, web_page = highlight.web_page, start = highlight.start, end = highlight.end, color = highlight.color });
                }
                return highlights;

            }
        }

        public HighlightModel InsertHighlight(HighlightModel highlight)
        {
            try
            {
                HighlightModel old = null;
                using (var db = new AnnotateWebPageDBEntities())
                {
                    old = GetHighlight(highlight.id);
                }
                if (old == null)
                {
                    // generate new id
                    using (var db = new AnnotateWebPageDBEntities())
                    {
                        //var nextId = db.Highlight.ToList().Max(hg => hg.id) + 1;
                        //highlight.id = nextId;
                        Highlight newHighlight = db.Highlight.Add(new Highlight() { user_id = highlight.user_id, web_page = highlight.web_page, start = highlight.start, end = highlight.end, color = highlight.color });
                        db.SaveChanges();
                        highlight.id = newHighlight.id;
                    }

                    return highlight;
                }
                else //update
                {
                    Highlight updateHighlight =null;
                    using (var db = new AnnotateWebPageDBEntities())
                    {
                        updateHighlight = db.Highlight.Where(s => s.id == highlight.id).FirstOrDefault<Highlight>();
                    }

                    if (updateHighlight != null)
                    {
                        updateHighlight.user_id = highlight.user_id;
                        updateHighlight.web_page = highlight.web_page;
                        updateHighlight.start = highlight.start;
                        updateHighlight.end = highlight.end;
                        updateHighlight.color = highlight.color;
                    }

                    using (var db = new AnnotateWebPageDBEntities())
                    {
                        db.Entry(updateHighlight).State = System.Data.Entity.EntityState.Modified;
                        db.SaveChanges();
                    }
                    return highlight;
                }

            }
            catch (Exception e)
            {
                
                return null;
            }
        }

        public bool DeleteHighlight(int highlightId)
        {
            using (var db = new AnnotateWebPageDBEntities())
            {
                Highlight highlight = db.Highlight.Where(s => s.id == highlightId).FirstOrDefault<Highlight>();
                if (highlight != null)
                {
                    db.Highlight.Remove(highlight);
                    db.SaveChanges();
                    return true;
                }
            }
            return false;
        }
    }
}