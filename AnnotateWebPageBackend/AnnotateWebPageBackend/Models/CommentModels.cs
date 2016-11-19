using AnnotateWebPageBackend.EntitiyDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnnotateWebPageBackend.Models
{
    public class CommentModels
    {
        public IEnumerable<Comment> GetComments()
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    return db.Comment.ToList();
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public Comment GetComment(int id)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    return db.Comment.ToList().SingleOrDefault(comment => comment.id == id);
                }

            }
            catch (Exception e)
            {
                throw;
            }

        }

        public Comment InsertComment(Comment comment)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                        db.Comment.Add(comment);
                        db.SaveChanges();
                        return comment;
                }

            }
            catch (Exception e)
            {
                throw;
            }
        }

        public bool UpdateComment(int id, Comment newComment)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    var comment = db.Comment.Where(c => c.id == id).FirstOrDefault<Comment>();
                    if (comment != null)
                    {
                        comment.text = newComment.text;
                        db.SaveChanges();
                        return true;
                    }
                    return false;
                }

            }
            catch (Exception e)
            {
                throw;
            }
        }

        public bool DeleteComment(int id)
        {
            using (var db = new AnnotateWebPageDBEntities())
            {
                var comment = db.Comment.Where(c => c.id == id).FirstOrDefault<Comment>();
                if (comment != null)
                {
                    db.Comment.Remove(comment);
                    db.SaveChanges();
                    return true;
                }
                return false;
            }

        }
    }
}
