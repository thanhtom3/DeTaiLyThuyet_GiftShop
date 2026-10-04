using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeTaiLyThuyet.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult ChiTiet()
        {
            return View();
        }

        public ActionResult SanPham()
        {
            return View();
        }
    }
}