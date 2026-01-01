import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import { useState } from "react";
import { useReviews } from "../context/ReviewsContext";
import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const PASSPHRASE = import.meta.env.VITE_ADMIN_PASSPHRASE;


export default function Admin() {
    const [date, setDate] = useState("");
    const [mood, setMood] = useState("");
    const [stress, setStress] = useState("");
    const [score, setScore] = useState("");
    const [note, setNote] = useState("");
    const { addReview } = useReviews();

    const adminEnabled = import.meta.env.VITE_ADMIN_SECRET;

    if (!adminEnabled) {
        return (
            <Typography sx={{ p: 4 }}>
                Admin access not configured.
            </Typography>
        );
    }


    const handleSubmit = () => {
        const payload = {
            date,
            mood,
            stress: Number(stress),
            score: Number(score),
            note,
        };

        addReview(payload);
        alert("Entry saved");
    };
    const [unlocked, setUnlocked] = useState(
        sessionStorage.getItem("adminUnlocked") === "true"
    );
    const [input, setInput] = useState("");

    if (!unlocked) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6">Admin Access</Typography>

                <TextField
                    type="password"
                    label="Passphrase"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{ mt: 2 }}
                    fullWidth
                />

                <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => {
                        if (input === PASSPHRASE) {
                            sessionStorage.setItem("adminUnlocked", "true");
                            setUnlocked(true);
                        }
                    }}
                >
                    Enter
                </Button>
            </Box>
        );
    }



    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Admin – Add Daily Review
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <TextField
                    select
                    label="Mood"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                >
                    <MenuItem value="happy">Happy</MenuItem>
                    <MenuItem value="sad">Sad</MenuItem>
                    <MenuItem value="anxious">Anxious</MenuItem>
                    <MenuItem value="angry">Angry</MenuItem>
                    <MenuItem value="neutral">Neutral</MenuItem>
                </TextField>

                <TextField
                    label="Stress caused (1–10)"
                    type="number"
                    value={stress}
                    onChange={(e) => setStress(e.target.value)}
                    inputProps={{ min: 1, max: 10 }}
                />

                <TextField
                    label="Performance score (1–10)"
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    inputProps={{ min: 1, max: 10 }}
                />

                <TextField
                    label="Notes"
                    multiline
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <Button variant="contained" onClick={handleSubmit}>
                    Save Entry
                </Button>
            </Stack>
        </Box>
    );
}
