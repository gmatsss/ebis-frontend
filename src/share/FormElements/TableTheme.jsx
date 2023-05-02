//theme
import { createTheme, useTheme, ThemeProvider } from "@mui/material";
const globalTheme = useTheme();
const TableTheme = () => {
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          //table
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          //selection row
          primary: {
            main: "rgb(241,245,5)", //add in a custom color for the toolbar alert background stuff
          },
          //table information or tavble top commands
          info: {
            main: "rgb(0,0,0)", //add in a custom color for the toolbar alert background stuff
          },

          //table color
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "rgb(254,255,244)" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
        },
        typography: {
          button: {
            textTransform: "none", //customize typography styles for all buttons in table by default
            fontSize: "1.2rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem", //override to make tooltip font size larger
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: "pink", //change the color of the switch thumb in the columns show/hide menu to pink
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  return <ThemeProvider theme={tableTheme} />;
};

export default TableTheme;
