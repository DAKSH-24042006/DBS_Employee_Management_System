package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.LeaveDAO;
import model.Leave;
import java.io.*;
import java.util.List;

public class LeaveHandler implements HttpHandler {
    private LeaveDAO dao = new LeaveDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String response = "";
        List<Leave> list = dao.getPendingLeaves();
        
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            Leave l = list.get(i);
            sb.append(String.format("{\"leaveId\":%d, \"empId\":%d, \"leaveType\":\"%s\", \"startDate\":\"%s\", \"endDate\":\"%s\", \"status\":\"%s\"}",
                l.getLeaveId(), l.getEmpId(), l.getLeaveType(), l.getStartDate(), l.getEndDate(), l.getStatus()));
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
