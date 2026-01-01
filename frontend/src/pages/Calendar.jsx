import {
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
    Box,
    Divider,
} from "@mui/material";
import { useReviews } from "../context/ReviewsContext";

function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function getScoreColor(score) {
    if (score <= 3) return "rgba(140, 28, 19, 0.12)"; // soft red
    if (score <= 7) return "rgba(167, 138, 127, 0.18)"; // warm yellow
    return "rgba(76, 175, 80, 0.15)"; // soft green
}


function getRangeChipStyle(value) {
    if (value <= 3) {
        return {
            backgroundColor: "rgba(140, 28, 19, 0.18)", // muted red
            color: "#735751",
        };
    }

    if (value <= 7) {
        return {
            backgroundColor: "rgba(167, 138, 127, 0.22)", // warm yellow
            color: "#735751",
        };
    }

    return {
        backgroundColor: "rgba(76, 175, 80, 0.22)", // soft green
        color: "#735751",
    };
}

function getMoodChipStyle(mood) {
    switch (mood) {
        case "happy":
            return { backgroundColor: "rgba(76, 175, 80, 0.25)", color: "#735751" };
        case "anxious":
            return { backgroundColor: "rgba(149, 117, 205, 0.25)", color: "#735751" };
        case "angry":
            return { backgroundColor: "rgba(140, 28, 19, 0.25)", color: "#735751" };
        case "sad":
            return { backgroundColor: "rgba(167, 138, 127, 0.25)", color: "#735751" };
        default:
            return { backgroundColor: "rgba(115, 87, 81, 0.18)", color: "#735751" };
    }
}


export default function Calendar() {
    const { reviews, loading } = useReviews();

    if (loading) {
        return <Typography>Loading…</Typography>;
    }


    return (
        <Stack spacing={2}>
            <Typography variant="h6">
                Daily Reviews
            </Typography>

            {reviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No reviews yet. Add one from the admin page.
                </Typography>
            ) : (
                reviews.map((day, index) => (
                    <Card
                        sx={{

                            transition: "background-color 0.2s ease",
                            "&:hover": {
                                filter: "brightness(0.97)",
                            },
                        }}
                    >


                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {formatDate(day.date)}
                            </Typography>



                            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                                <Chip
                                    label={`Mood: ${day.mood}`}
                                    sx={getMoodChipStyle(day.mood)}
                                />
                                <Chip
                                    label={`Score: ${day.score}/10`}
                                    sx={getRangeChipStyle(day.score)}
                                />
                                <Chip
                                    label={`Stress: ${day.stress}/10`}
                                    sx={getRangeChipStyle(day.stress)}
                                />
                            </Box>


                            <Divider sx={{ my: 1.5 }} />

                            <Typography variant="body1" color="text.secondary">
                                {day.note}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Stack>
    );
}
