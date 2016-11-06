using AnnotateWebPageBackend.EntitiyDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnnotateWebPageBackend.Models
{
    public class UserModels
    {
        public IEnumerable<User> GetUsers()
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    return db.User.ToList();
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public User GetUser(string id)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    return db.User.ToList().SingleOrDefault(user => user.id.Equals(id));
                }

            }
            catch (Exception)
            {
                throw;
            }

        }

        public User InsertUser(User user)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    var resp = GetUser(user.id);
                    if (GetUser(user.id) == null)
                    {
                        db.User.Add(user);
                        db.SaveChanges();
                        return user;
                    }
                    return null;
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