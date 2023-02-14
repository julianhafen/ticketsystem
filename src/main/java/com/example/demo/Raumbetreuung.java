package com.example.demo;

import java.util.ArrayList;

public class Raumbetreuung {
	private int rb_id;
	private String email;
	private ArrayList<Integer> raeume = new ArrayList<Integer>();
	private int user_id;
	private int raum_id;
	
	public void addElement(int x) {
		raeume.add(x);
	}
	
	public ArrayList<Integer> getRaeume() {
		return raeume;
	}

	public void setRaeume(ArrayList<Integer> raeume) {
		this.raeume = raeume;
	}


	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}


	
	public int getRb_id() {
		return rb_id;
	}

	public void setRb_id(int rb_id) {
		this.rb_id = rb_id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public int getRaum_id() {
		return raum_id;
	}

	public void setRaum_id(int raum_id) {
		this.raum_id = raum_id;
	}
}
