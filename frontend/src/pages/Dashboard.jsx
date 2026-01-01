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

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
);

function isSameWeek(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();

    const getMonday = (d) => {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const weekStart = getMonday(new Date(date));
    const currentWeekStart = getMonday(new Date(now));

    return weekStart.toDateString() === currentWeekStart.toDateString();
}

function calculateStreak(reviews) {
    if (reviews.length === 0) return 0;

    const sorted = [...reviews].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    let currentDate = new Date(sorted[0].date);

    for (const r of sorted) {
        const reviewDate = new Date(r.date);
        const diff =
            (currentDate - reviewDate) / (1000 * 60 * 60 * 24);

        if (diff > 1) break; // gap breaks streak
        if (r.score < 7) break;

        streak += 1;
        currentDate = reviewDate;
    }

    return streak;
}

function getRangeChipStyle(value) {
    if (value <= 3) {
        return {
            backgroundColor: "rgba(140, 28, 19, 0.18)",
            color: "#735751",
        };
    }

    if (value <= 7) {
        return {
            backgroundColor: "rgba(167, 138, 127, 0.22)",
            color: "#735751",
        };
    }

    return {
        backgroundColor: "rgba(76, 175, 80, 0.22)",
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
function getWeekKey(dateStr) {
    const date = new Date(dateStr);
    const firstDay = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    return firstDay.toISOString().slice(0, 10); // YYYY-MM-DD (Monday)
}




export default function Dashboard() {



    const { reviews, loading } = useReviews();

    if (loading) {
        return <Typography>Loading…</Typography>;
    }
    const latest = reviews[reviews.length - 1];

    // Derived values (safe)
    const mood = latest?.mood ?? "—";
    const stress = latest?.stress ?? "—";
    const score = latest?.score ?? "—";
    const insightText = latest?.note ?? "No entry for today yet.";


    const sortedReviews = [...reviews].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const thisWeekReviews = sortedReviews.filter((r) =>
        isSameWeek(r.date)
    );

    const weeklyAverage =
        thisWeekReviews.length === 0
            ? "—"
            : (
                thisWeekReviews.reduce((sum, r) => sum + r.score, 0) /
                thisWeekReviews.length
            ).toFixed(1);

    const currentStreak = calculateStreak(sortedReviews);


    const weeklyMap = {};

    sortedReviews.forEach((r) => {
        const week = getWeekKey(r.date);
        if (!weeklyMap[week]) weeklyMap[week] = [];
        weeklyMap[week].push(r.score);
    });

    const weeklyAverages = Object.entries(weeklyMap).map(
        ([weekStart, scores]) => ({
            weekStart,
            avg:
                scores.reduce((sum, s) => sum + s, 0) / scores.length,
        })
    );
    const weeklyChartData = {
        labels: weeklyAverages.map((w) =>
            new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
            }).format(new Date(w.weekStart))
        ),
        datasets: [
            {
                label: "Weekly Average",
                data: weeklyAverages.map((w) => w.avg.toFixed(1)),
                borderColor: "#735751",
                backgroundColor: "rgba(115, 87, 81, 0.15)",
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const chartData = {
        labels: sortedReviews.map((r) =>
            new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
            }).format(new Date(r.date))
        ),
        datasets: [
            {
                label: "Daily Score",
                data: sortedReviews.map((r) => r.score),
                borderColor: "#8C1C13",
                backgroundColor: "rgba(140, 28, 19, 0.15)",
                tension: 0.35,
                borderWidth: 2,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };


    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `Score: ${ctx.raw}/10`,
                },
            },
        },
        scales: {
            y: {
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 2,
                    color: "#735751",
                },
                grid: {
                    color: "rgba(115, 87, 81, 0.15)",
                },
            },
            x: {
                ticks: {
                    color: "#735751",
                },
                grid: {
                    display: false,
                },
            },
        },
    };


    return (
        <Stack spacing={2}>
            {/* Insight Card */}
            <Card
                sx={{
                    backgroundColor: "#FFFFFF",
                    border: "2px solid",
                    borderColor: "primary.main",
                }}
            >
                <CardContent>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            lineHeight: 1.6,
                        }}
                    >
                        My boyfriend is a corporate addict, and he wont listen to me, so i made him a Performance Dashboard, where he needs to track his Performance or I will beat him.
                    </Typography>
                </CardContent>
            </Card>



            <Card
                sx={{
                    borderLeft: "4px solid",
                    borderLeftColor: "primary.main",
                    borderTop: "none",
                    borderRight: "none",
                    borderBottom: "none",
                }}
            >
                <CardContent>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                    >
                        Today’s Summary
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ mt: 1 }}
                    >
                        {insightText}
                    </Typography>
                </CardContent>
            </Card>


            {/* Metrics Card */}

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Today’s Metrics
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Chip
                            label={`Score: ${score}/10`}
                            sx={{ ...getRangeChipStyle(score), fontWeight: 600 }}
                        />
                        <Chip
                            label={`Mood: ${mood}`}
                            sx={getMoodChipStyle(mood)}
                        />
                        <Chip
                            label={`Stress: ${stress}/10`}
                            sx={getRangeChipStyle(stress)}
                        />
                    </Box>

                </CardContent>
            </Card>

            {/* Weekly Snapshot */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Weekly Snapshot
                    </Typography>

                    <Typography variant="body1">
                        Average score this week:{" "}
                        <strong>{weeklyAverage}</strong>
                    </Typography>

                    <Typography variant="body1">
                        Current streak:{" "}
                        <strong>{currentStreak} good day{currentStreak === 1 ? "" : "s"}</strong>
                    </Typography>
                </CardContent>
            </Card>


            {/* Chart */}
            {sortedReviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No data yet to display trends.
                </Typography>
            ) : (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Performance Trend
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ height: 220 }}>
                            <Line data={chartData} options={chartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            )}


        </Stack>
    );
}
