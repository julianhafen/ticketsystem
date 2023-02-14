package com.example.demo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
public class DBController {

	@Autowired
	JdbcTemplate jdbcTemplate;

	@Autowired
	HttpServletRequest request;

	@GetMapping("/getRaeume")
	public String getRaeume() {
		ArrayList<Raum> raeume = new ArrayList<Raum>();
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "SELECT * FROM raeume";
			PreparedStatement ps = con.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Raum raum = new Raum();
				raeume.add(raum);
				raum.setRaum_id(rs.getInt(1));
				raum.setBeschreibung(rs.getString(2));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		ObjectMapper objectMapper = new ObjectMapper();
		String response = "";
		try {
			response = objectMapper.writeValueAsString(raeume);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	@GetMapping("/getTicketsLehrer")
	public String getTicketsLehrer() {
		ArrayList<Ticket> tickets = new ArrayList<Ticket>();
		HttpSession session = request.getSession(false);
		int uid = (int) session.getAttribute("user_id");
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "SELECT * FROM tickets WHERE user_id=?";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, "" + uid);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Ticket ticket = new Ticket();
				tickets.add(ticket);
				ticket.setTicket_id(rs.getInt(1));
				ticket.setTitel(rs.getString(2));
				ticket.setBeschreibung(rs.getString(3));
				ticket.setStatus(rs.getString(4));
				ticket.setDatum(rs.getString(5));
				ticket.setRaum_id(rs.getInt(6));
				ticket.setUser_id(rs.getInt(7));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		ObjectMapper objectMapper = new ObjectMapper();
		String response = "";
		try {
			response = objectMapper.writeValueAsString(tickets);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	@GetMapping("/getTicketsBetreuer")
	public String getTicketsBetreuer() {
		ArrayList<Ticket> tickets = new ArrayList<Ticket>();
		HttpSession session = request.getSession(false);
		int uid = (int) session.getAttribute("user_id");
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "SELECT * FROM tickets INNER JOIN raumbetreuung ON tickets.raum_id=raumbetreuung.raum_id WHERE raumbetreuung.user_id=?";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, "" + uid);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Ticket ticket = new Ticket();
				tickets.add(ticket);
				ticket.setTicket_id(rs.getInt(1));
				ticket.setTitel(rs.getString(2));
				ticket.setBeschreibung(rs.getString(3));
				ticket.setStatus(rs.getString(4));
				ticket.setDatum(rs.getString(5));
				ticket.setRaum_id(rs.getInt(6));
				ticket.setUser_id(rs.getInt(7));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		ObjectMapper objectMapper = new ObjectMapper();
		String response = "";
		try {
			response = objectMapper.writeValueAsString(tickets);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	@GetMapping("/getRolle")
	public String getRolle() {
		HttpSession session = request.getSession(false);
		String result = "";
		int uid = (int) session.getAttribute("user_id");
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "SELECT rolle FROM users WHERE user_id=?";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, "" + uid);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				result = rs.getString(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}

	@GetMapping("/getRaeumeBetreuer")
	public String getRaeumeBetreuer() {
		ArrayList<Raum> raeume = new ArrayList<Raum>();
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "SELECT * FROM raeume";
			PreparedStatement ps = con.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Raum raum = new Raum();
				raeume.add(raum);
				raum.setRaum_id(rs.getInt(1));
				raum.setBeschreibung(rs.getString(2));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		ObjectMapper objectMapper = new ObjectMapper();
		String response = "";
		try {
			response = objectMapper.writeValueAsString(raeume);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	@PostMapping("/createUser")
	public String createUser(@RequestBody User user) {
		String result = "false";
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "INSERT INTO users (email, vorname, nachname, kennwort, rolle) VALUES (?, ?, ?, ?, ?)";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, user.getEmail());
			ps.setString(2, user.getName());
			ps.setString(3, user.getSurname());
			ps.setString(4, user.getPassword());
			ps.setString(5, user.getRole());
			ps.executeUpdate();
			result = "true";

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}

	@PostMapping("/createBetreuung")
	public void createBetreuung(@RequestBody Raumbetreuung raumbetreuung) {
		int user_id = 0;
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "SELECT user_id FROM users WHERE email=?";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, raumbetreuung.getEmail());
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				if (rs.getString(1).length() > 0) {
					user_id = rs.getInt(1);
				}
				;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		for (int x : raumbetreuung.getRaeume()) {
			try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
				String sql = "INSERT INTO raumbetreuung (raum_id, user_id) VALUES (?, ?)";
				PreparedStatement ps = con.prepareStatement(sql);
				ps.setInt(1, x);
				ps.setInt(2, user_id);
				ps.executeUpdate();

			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

	}

	@PostMapping("/createTicket")
	public String createTicket(@RequestBody Ticket ticket) {
		HttpSession session = request.getSession(false);
		if (session == null) {
			return "false";
		}

		int uid = (int) session.getAttribute("user_id");

		String result = "false";
		LocalDate localDate = LocalDate.now();// For reference
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy");
		String formattedDate = localDate.format(formatter);

		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "INSERT INTO tickets (titel, beschreibung, status, datum, raum_id, user_id) VALUES (?, ?, ?, ?, ?, ?)";
			PreparedStatement ps = con.prepareStatement(sql);

			ps.setString(1, ticket.getTitel());
			ps.setString(2, ticket.getBeschreibung());
			ps.setString(3, "offen");
			ps.setString(4, formattedDate);
			ps.setInt(5, ticket.getRaum_id());
			ps.setInt(6, uid);
			System.out.println("Test");
			System.out.println(ps);
			ps.executeUpdate();
			result = "true";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}

	@PostMapping("/updateTicket")
	public void updateTicket(@RequestBody Ticket ticket) {
		HttpSession session = request.getSession(false);
		if (session == null) {
			return;
		}
		int uid = (int) session.getAttribute("user_id");
		

		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "UPDATE tickets SET status=geschlossen WHERE raum_id=?";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, ""+uid);
			ps.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	@PostMapping("/loginUser")
	public String loginUser(@RequestBody User user) {
		String result = "false";
		try (Connection con = jdbcTemplate.getDataSource().getConnection()) {
			String sql = "SELECT user_id FROM users WHERE email=? && kennwort=?";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, user.getEmail());
			ps.setString(2, user.getPassword());
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				result = "true";
				HttpSession session = request.getSession(true);
				session.setAttribute("user_id", rs.getInt(1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
}
