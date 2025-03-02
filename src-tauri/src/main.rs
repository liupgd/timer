// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};
use tauri_plugin_dialog;
use tauri_plugin_store;

#[tauri::command]
fn open_settings(app_handle: AppHandle) {
    if let Some(settings_window) = app_handle.get_webview_window("settings") {
        settings_window.show().unwrap();
    } else {
        println!("Settings window not found");
    }
}


fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![open_settings])
        .setup(|_app| {
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
