using AnnotateWebPageBackend.EntitiyDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnnotateWebPageBackend.Models
{
    public class UserModel{
        public string id { get; set; }
        public string name { get; set; }
    }

    public class UserModels
    {
        public IEnumerable<UserModel> GetUsers()
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    List<UserModel> users = new List<UserModel>();
                    foreach (var user in db.User)
                    {
                        users.Add(new UserModel() { id = user.id, name = user.name });
                    }

                    return users;
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public UserModel GetUser(string id)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    foreach (var user in db.User)
                    {
                        if (user.id.Equals(id)) return new UserModel() { id = user.id, name = user.name };
                    }

                    return null;
                }

            }
            catch (Exception e)
            {
                // throw;
                return null;
            }

        }

        public UserModel InsertUser(UserModel user)
        {
            try
            {
                using (var db = new AnnotateWebPageDBEntities())
                {
                    var resp = GetUser(user.id);
                    if (GetUser(user.id) == null)
                    {
                        User newUser = new User() { id = user.id, name = user.name };
                        db.User.Add(newUser);
                        db.SaveChanges();
                        return user;
                    }
                    return null;
                }

            }
            catch (Exception e)
            {
                //throw;
                return null;
            }
        }
    }
}