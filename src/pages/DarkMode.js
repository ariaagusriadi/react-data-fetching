import { Button, useColorMode } from "@chakra-ui/react";

export const DarkMode = () => {
     const { colorMode, toggleColorMode } = useColorMode();
     return (
       <header>
         <Button mt={4} mb={4} onClick={toggleColorMode}>
           Theme {colorMode === "light" ? "Dark" : "Light"}
         </Button>
       </header>
     );
}