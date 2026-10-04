using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeTaiLyThuyet.Controllers
{
    public class OrderController : Controller
    {
        // GET: Order
        public ActionResult DonHang()
        {
            return View();
        }

        public ActionResult ThanhToan()
        {
            return View();
        }
    }
}