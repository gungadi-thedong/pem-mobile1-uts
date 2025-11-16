import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from "react-native";
import ReactDOM from "react-dom";

const Portal = ({ children }) => {
  if (Platform.OS !== "web") return children;
  return ReactDOM.createPortal(children, document.body);
};

export default function Dropdown({ items, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const selectedLabel = items.find(i => i.value === value)?.label || placeholder;

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <Text style={!value ? styles.placeholder : styles.text}>{selectedLabel}</Text>
        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        <Portal>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 250 }}>
                {items.map(item => (
                  <Pressable
                    key={item.value}
                    style={styles.item}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text>{item.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: { color: "#000" },
  placeholder: { color: "#777" },
  arrow: { fontSize: 14 },

  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.10)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },

  dropdown: {
    width: 300,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  item: {
    padding: 12,
  }
});
