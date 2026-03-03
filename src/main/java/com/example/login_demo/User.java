package com.example.login_demo;
public class User {
	private String username;
	private String password;
	//to access user name
	public String getUsername(){
		return username;
	}
	public void setUsername(String username) {
		this.username=username;
	}
	//to access password
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password=password;
	}
}
