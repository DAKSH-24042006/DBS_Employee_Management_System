package servlet;

import com.google.gson.Gson;
import dao.AttendanceDAO;
import model.Attendance;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/attendance")
public class AttendanceServlet extends HttpServlet {
    private AttendanceDAO dao = new AttendanceDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Attendance> list = dao.getAllAttendance();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(list));
    }
}
