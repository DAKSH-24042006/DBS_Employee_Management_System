package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.EmployeeDAO;
import java.io.*;
import java.util.List;

public class ReportHandler implements HttpHandler {
    private EmployeeDAO dao = new EmployeeDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        String type = query != null ? query.split("=")[1] : "";
        List<String> data;

        switch (type.toLowerCase()) {
            case "join": data = dao.getEmployeeAttendanceStatus(); break;
            case "groupby": data = dao.getDeptAttendanceSummary(); break;
            case "nested": data = dao.getHighLeaveEmployees(); break;
            default: data = List.of("Invalid Report Type");
        }

        // Serialize as simple JSON array of strings
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < data.size(); i++) {
            sb.append("\"").append(data.get(i)).append("\"");
            if (i < data.size() - 1) sb.append(",");
        }
        sb.append("]");
        
        String response = sb.toString();
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
