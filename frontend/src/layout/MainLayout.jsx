import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
    const navigate = useNavigate();

    return (
        <>
            <AppBar position="sticky">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">
                        Yashudi.exe
                    </Typography>

                    <Box>
                        <Button color="inherit" onClick={() => navigate("/")}>
                            Dashboard
                        </Button>
                        <Button color="inherit" onClick={() => navigate("/calendar")}>
                            Calendar
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 3 }}>
                <Outlet />
            </Container>
        </>
    );
}
