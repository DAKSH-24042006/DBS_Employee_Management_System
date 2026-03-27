package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.AttendanceDAO;
import model.Attendance;
import java.io.*;
import java.util.List;

public class AttendanceHandler implements HttpHandler {
    private AttendanceDAO dao = new AttendanceDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String response = "";
        // For demo, list all attendance for emp_id 3 or 4 if no ID
        List<Attendance> list = dao.getAttendanceByEmployee(3);
        
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            Attendance a = list.get(i);
            sb.append(String.format("{\"date\":\"%s\", \"empId\":%d, \"checkInTime\":\"%s\", \"status\":\"%s\"}",
                a.getDate(), a.getEmpId(), a.getCheckInTime(), a.getStatus()));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        response = sb.toString();

        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
