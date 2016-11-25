using AnnotateWebPageBackend.EntitiyDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnnotateWebPageBackend.Models
{
    public class CommentModels
    {
        public class CommentModel
        {
            public int id { get; set; }
            public string text { get; set; }
            public string color { get; set; }
            public string user_id { get; set; }
            public string web_page { get; set; }
        }
        public IEnumerable<CommentModel> GetComments()
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    List<CommentModel> comments = new List<CommentModel>();
                    foreach (var comment in db.Comment)
                    {
                        comments.Add(new CommentModel() { id = comment.id, text = comment.text, color = comment.color, user_id = comment.user_id, web_page = comment.web_page });
                    }
                    return comments;
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public CommentModel GetComment(int id)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    foreach (var comment in db.Comment)
                    {
                        if (comment.id == id) return new CommentModel() { id = comment.id, text = comment.text, color = comment.color, user_id = comment.user_id, web_page = comment.web_page };
                    }

                    return null;

                }

            }
            catch (Exception e)
            {
                throw;
            }

        }

        public List<CommentModel> GetComment(string userId, string url)
        {
            using (var db = new AnnotateWebPageDBEntities())
            {
                List<CommentModel> comments = new List<CommentModel>();
                foreach (var comment in db.Comment)
                {
                    if (comment.user_id.Equals(userId) && comment.web_page.Equals(url))
                        comments.Add(new CommentModel() { id = comment.id, text = comment.text, color = comment.color, user_id = comment.user_id, web_page = comment.web_page });
                }
                return comments;

            }
        }

        public CommentModel InsertComment(CommentModel comment)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    Comment newComment = new Comment() { id = comment.id, text = comment.text, color = comment.color, user_id = comment.user_id, web_page = comment.web_page };
                    db.Comment.Add(newComment);
                    db.SaveChanges();
                    return comment;
                }

            }
            catch (Exception e)
            {
                throw;
            }
        }

        public bool UpdateComment(int id, CommentModel newComment)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    var comment = db.Comment.Where(c => c.id == id).FirstOrDefault<Comment>();
                    if (comment != null)
                    {
                        comment.text = newComment.text;
                        comment.color = newComment.color;
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
