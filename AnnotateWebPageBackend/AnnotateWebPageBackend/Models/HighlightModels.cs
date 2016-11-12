﻿using AnnotateWebPageBackend.EntitiyDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnnotateWebPageBackend.Models
{
    public class HighlightModels
    {
        public IEnumerable<Highlight> GetHighlights()
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    return db.Highlight.ToList();
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public Highlight GetHighlight(int id)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    return db.Highlight.ToList().SingleOrDefault(highlight => highlight.id.Equals(id));
                }

            }
            catch (Exception)
            {
                throw;
            }

        }

        public Highlight InsertHighlight(Highlight highlight)
        {
            try
            {
                Highlight old = null;
                using (var db = new AnnotateWebPageDBEntities())
                {
                    old = GetHighlight(highlight.id);
                }
                if (old == null)
                {
                    // generate new id
                    using (var db = new AnnotateWebPageDBEntities())
                    {
                        var nextId = db.Highlight.ToList().Max(hg => hg.id) + 1;
                        highlight.id = nextId;
                        db.Highlight.Add(highlight);
                        db.SaveChanges();
                    }

                    return highlight;
                }
                else //update
                {
                    using (var db = new AnnotateWebPageDBEntities())
                    {
                        old = db.Highlight.Where(s => s.id == highlight.id).FirstOrDefault<Highlight>();
                    }

                    if (old != null)
                    {
                        old.user_id = highlight.user_id;
                        old.web_page = highlight.web_page;
                        old.start = highlight.start;
                        old.end = highlight.end;
                    }

                    using (var db = new AnnotateWebPageDBEntities())
                    {
                        db.Entry(old).State = System.Data.Entity.EntityState.Modified;
                        db.SaveChanges();
                    }
                    return old;
                }

            }
            catch (Exception)
            {
                //throw;
                return null;
            }
        }
    }
}