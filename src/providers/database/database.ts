import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

	private db: SQLiteObject;
	public isOpen: boolean = false;

	constructor(public http: HttpClient, public storage: SQLite) {

		console.log('Hello DatabaseProvider Provider');

		if (!this.isOpen) {
			this.storage = new SQLite();
			this.storage.create({ name: "data.db", location: "default" }).then((db: SQLiteObject) => {
				this.db = db;
				db.executeSql("CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, package_id INTEGER)", []);
				db.executeSql("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, session TEXT, welcome INTEGER)", []);
				//db.executeSql("INSERT INTO user (id, session) VALUES (1, 'not logged') WHERE NOT EXISTS(SELECT * FROM user WHERE id = 1)", []);
				this.isOpen = true;
				console.info("Opened data.db with success");
			}).catch((error) => {
				console.log(error);
			})
		}
	}

	createUser(session: string) {
		return new Promise((resolve, reject) => {
			let sql = "INSERT INTO user (id, session, welcome) VALUES (?, ?, ?)";
			this.db.executeSql(sql, [1, session, 1]).then((data) => {
				resolve(data);
			}, (error) => {
				reject(error);
			});
		});
	}

	setUser(session: string) {
		return new Promise((resolve, reject) => {
			let sql = "UPDATE user SET session = (?) WHERE ID = 1";
			this.db.executeSql(sql, [session]).then((data) => {
				resolve(data);
			}, (error) => {
				reject(error);
			});
		});
	}

	isCreatedUser() {
		return new Promise((resolve, reject) => {
			this.db.executeSql("SELECT * FROM user", []).then((data) => {
				if (data.rows.length > 0) {
					resolve(1);
				}
				else {
					resolve(0);
				}
			}, (error) => {
				reject(error);
			})
		})
	}

	getUser() {
		return new Promise((resolve, reject) => {
			this.db.executeSql("SELECT * FROM user", []).then((data) => {
				if (data.rows.length > 0) {
					resolve(data.rows.item(0));
				}
				else {
					resolve(0);
				}
			}, (error) => {
				reject(error);
			})
		})
	}

	addFavorite(package_id: number) {
		return new Promise((resolve, reject) => {
			let sql = "INSERT INTO favorites (package_id) VALUES (?)";
			this.db.executeSql(sql, [package_id]).then((data) => {
				resolve(data);
			}, (error) => {
				reject(error);
			});
		});
	}

	removeWelcome() {
		return new Promise((resolve, reject) => {
			let sql = "UPDATE user SET welcome = (?) WHERE ID = 1";
			this.db.executeSql(sql, [0]).then((data) => {
				resolve(data);
			}, (error) => {
				reject(error);
			});
		});
	}

	getWelcome() {
		return new Promise((resolve, reject) => {
			this.db.executeSql("SELECT welcome FROM user", []).then((data) => {
				if (data.rows.length > 0) {
					resolve(data.rows.item(0).welcome);
				}
			}, (error) => {
				reject(error);
			})
		})
	}

	getFavorites() {
		return new Promise((resolve, reject) => {
			this.db.executeSql("SELECT * FROM favorites", []).then((data) => {
				let idsPackages: string = '';
				if (data.rows.length > 0) {
					for (var i = 0; i < data.rows.length; i++) {
						idsPackages += data.rows.item(i).package_id + '_';
					}
				}
				resolve(idsPackages);
			}, (error) => {
				reject(error);
			})
		})
	}

	removeFavorite(package_id: number) {
		return new Promise((resolve, reject) => {
			let sql = "DELETE FROM favorites WHERE package_id = ?";
			this.db.executeSql(sql, [package_id]).then((data) => {
				resolve(data);
			}, (error) => {
				reject(error);
			});
		});
	}

	getFavorite(package_id: number) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM favorites WHERE package_id = ?";
			this.db.executeSql(sql, [package_id]).then((data) => {
				let favorite: boolean = false;
				if (data.rows.length > 0) {
					favorite = true;
				}
				resolve(favorite);
			}, (error) => {
				reject(error);
			});
		});
	}
}
