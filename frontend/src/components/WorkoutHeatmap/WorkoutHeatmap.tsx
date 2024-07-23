import React, { useState, useEffect } from "react";
import styles from "./WorkoutHeatmap.module.css";

interface HeatmapData {
  [date: string]: number;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WorkoutHeatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData>({});

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user-statistics/heatmap`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setHeatmapData(data);
        } else {
          console.error("Failed to fetch heatmap data");
        }
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchHeatmapData();
  }, []);

  const generateCalendar = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());

    const calendar = [];
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split("T")[0];
      const count = heatmapData[dateString] || 0;
      calendar.push({ date: new Date(d), count });
    }

    return calendar;
  };

  const getColorClass = (count: number): string => {
    if (count === 0) return styles.emptyCell;
    if (count === 1) return styles.lightCell;
    if (count === 2) return styles.mediumCell;
    return styles.darkCell;
  };

  const calendar = generateCalendar();

  const renderMonthLabels = () => {
    const monthLabels: any[] = [];
    let currentMonth = -1;

    calendar.forEach((day, index) => {
      if (day.date.getDate() <= 7 && day.date.getMonth() !== currentMonth) {
        currentMonth = day.date.getMonth();
        monthLabels.push(
          <div
            key={`month-${index}`}
            className={styles.monthLabel}
            style={{ gridColumn: index + 1 }}
          >
            {MONTHS[currentMonth]}
          </div>
        );
      }
    });

    return monthLabels;
  };

  return (
    <div className={styles.heatmapContainer}>
      <div className={styles.heatmapWrapper}>
        <div className={styles.heatmapContent}>
          <div className={styles.monthLabels}>{renderMonthLabels()}</div>
          <div className={styles.graphRow}>
            <div className={styles.dayLabels}>
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className={styles.dayLabel}>
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.heatmap}>
              {calendar.map((day, index) => (
                <div
                  key={index}
                  className={`${styles.heatmapCell} ${getColorClass(
                    day.count
                  )}`}
                  title={`${day.date.toDateString()}: ${day.count} workout${
                    day.count !== 1 ? "s" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutHeatmap;
