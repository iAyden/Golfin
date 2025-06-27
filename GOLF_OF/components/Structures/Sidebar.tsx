import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Route, useRouter } from "expo-router";

// DEFINIMOS LOS TIPOS PARA LAS PROPS DEL COMPONENTE
type SidebarProps = {
  isVisible: boolean;
  width: Animated.Value;
  onMenuItemPress: (menuItem: string) => void;
  activeMenuItem: string;
};

// DEFINIMOS EL TIPO PARA LOS ITEMS DEL MENU
type MenuItem = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
};

// DATOS DEL MENU CORTO AQUI MODIFICAMOS LOS REDIRECCIONAMIENTOS
const MENU_ITEMS: MenuItem[] = [
  { id: "/", title: "Home", icon: "home" },
  { id: "createLobby", title: "New Game", icon: "gamepad" },
  { id: "profileStats", title: "Profile", icon: "newspaper-o" },
  { id: "LeaderBoard", title: "Ranking", icon: "trophy" },
  { id: "LogUser", title: "Sign Up", icon: "user" },
  { id: "gameplay", title: "Log Out", icon: "sign-out" },
];

const Sidebar: React.FC<SidebarProps & { style?: any }> = ({
  isVisible,
  width,
  onMenuItemPress,
  activeMenuItem,
  style,
}) => {
  const router = useRouter(); // EL MALDITO COMPONENTE NUNCA ELIMINAR
  return (
    <Animated.View style={[styles.sidebar, style, { width }]}>
      {isVisible && (
        <>
          {/* AQUI ESTA EL ENCABEZADO DE LA SIDE BAR, HAY QUE VER EL LOGO PARA VER COMO SE PUEDE HACER */}
          <View style={styles.sidebarHeader}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.sidebarLogo}
              accessibilityLabel="Logo Eco Noticias"
            />
            <Text style={styles.sidebarTitle}>golfin'</Text>
          </View>

          {/* AQUI ESTAN LOS ITEMS DE LOS MENUS*/}
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.sidebarButton,
                activeMenuItem === item.id && styles.activeButton,
              ]}
              onPress={() => {
                onMenuItemPress(item.id);
                router.push(item.id as Route);
              }}
            >
              <FontAwesome name={item.icon} size={18} color="#f0fff4" />
              <Text style={styles.sidebarButtonText}> {item.title}</Text>
            </TouchableOpacity>
          ))}

          {/* UN FOPOTER DENTRO DEL PERRO SIDEBAR  */}
          <View style={styles.sidebarFooter}>
            <Text style={styles.footerText}>MICRO RATONES</Text>
          </View>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: "rgba(15, 76, 45, 0.98)",
    padding: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#38a169",
  },
  sidebarLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sidebarTitle: {
    color: "#c6f6d5",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "gharison",
  },
  sidebarButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 10,
    paddingLeft: 15,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#2f855a",
  },
  sidebarButtonText: {
    color: "#f0fff4",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  sidebarFooter: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderTopWidth: 1,
    borderTopColor: "#38a169",
    paddingTop: 10,
  },
  footerText: {
    color: "#c6f6d5",
    fontSize: 12,
    textAlign: "center",
  },
});

export default Sidebar;
