//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AnnotateWebPageBackend.EntitiyDataModels
{
    using System;
    using System.Collections.Generic;
    
    public partial class Comment
    {
        public int id { get; set; }
        public string text { get; set; }
        public string color { get; set; }
        public string user_id { get; set; }
        public string web_page { get; set; }
    
        public virtual User User { get; set; }
    }
}