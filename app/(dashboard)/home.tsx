
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";

// Job type
type JobDetail = {
  id: string;
  title: string;
  deadline: string;
  details: string;
  time: string;
  duration: string;
  completed: boolean;
};

type JobDeadlines = {
  [date: string]: JobDetail[];
};

// Example job deadlines and details
const initialJobDeadlines: JobDeadlines = {
  "2025-09-25": [
    { id: "1", title: "Frontend Developer", deadline: "2025-09-25", details: "Apply before midnight.", time: "09:00", duration: "2h", completed: false },
    { id: "2", title: "UI/UX Designer", deadline: "2025-09-25", details: "Portfolio required.", time: "13:00", duration: "1.5h", completed: true },
  ],
  "2025-09-27": [
    { id: "3", title: "Backend Engineer", deadline: "2025-09-27", details: "Remote position.", time: "15:00", duration: "3h", completed: false },
  ],
};


import { TextInput, Button } from "react-native";

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [jobDeadlines, setJobDeadlines] = useState<JobDeadlines>(initialJobDeadlines);
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDuration, setEditDuration] = useState("");

  // Marked dates for calendar
  const markedDates = Object.keys(jobDeadlines).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: "#2196F3",
      selected: date === selectedDate,
      selectedColor: "#1976D2",
    };
    return acc;
  }, {} as any);
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: "#1976D2",
    };
  }

  const jobsForDate: JobDetail[] = jobDeadlines[selectedDate] || [];

  // Add new job detail for selected date
  const handleAddDetail = () => {
    if (!selectedDate || !newTitle) return;
    const newJob: JobDetail = {
      id: Date.now().toString(),
      title: newTitle,
      deadline: selectedDate,
      details: newDetails,
      time: newTime,
      duration: newDuration,
      completed: false,
    };
    setJobDeadlines(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate] ? [...prev[selectedDate], newJob] : [newJob],
    }));
    setNewTitle("");
    setNewDetails("");
    setNewTime("");
    setNewDuration("");
  };

  // Delete job detail
  const handleDelete = (jobId: string) => {
    setJobDeadlines(prev => {
      const updated = { ...prev };
      updated[selectedDate] = (updated[selectedDate] || []).filter(job => job.id !== jobId);
      return updated;
    });
    if (editId === jobId) setEditId(null);
  };

  // Start editing a job
  const handleEditStart = (job: JobDetail) => {
    setEditId(job.id);
    setEditTitle(job.title);
    setEditDetails(job.details);
    setEditTime(job.time);
    setEditDuration(job.duration);
  };

  // Save edited job
  const handleEditSave = () => {
    setJobDeadlines(prev => {
      const updated = { ...prev };
      updated[selectedDate] = (updated[selectedDate] || []).map(job =>
        job.id === editId
          ? { ...job, title: editTitle, details: editDetails, time: editTime, duration: editDuration }
          : job
      );
      return updated;
    });
    setEditId(null);
    setEditTitle("");
    setEditDetails("");
    setEditTime("");
    setEditDuration("");
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditDetails("");
    setEditTime("");
    setEditDuration("");
  };

  // Toggle completed status
  const handleToggleComplete = (jobId: string) => {
    setJobDeadlines(prev => {
      const updated = { ...prev };
      const jobs = updated[selectedDate] || [];
      updated[selectedDate] = jobs.map(job =>
        job.id === jobId ? { ...job, completed: !job.completed } : job
      );
      return updated;
    });
  };

  // Helper to calculate end time
  const getTimeRange = (time: string, duration: string) => {
    if (!time || !duration) return "-";
    // Parse time (HH:mm)
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return "-";
    let endH = h, endM = m;
    let range = "";
    if (/^\d+(\.\d+)?h$/.test(duration)) {
      // Hours
      const hours = parseFloat(duration.replace("h", ""));
      endH += Math.floor(hours);
      endM += Math.round((hours % 1) * 60);
      if (endM >= 60) {
        endH += Math.floor(endM / 60);
        endM = endM % 60;
      }
      range = `${time} - ${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    } else if (/^\d+d$/.test(duration)) {
      // Days
      const days = parseInt(duration.replace("d", ""));
      range = `${time} + ${days} day${days > 1 ? "s" : ""}`;
    } else {
      range = "-";
    }
    return range;
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Job Calendar</Text>
        <Calendar
          onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          style={styles.calendar}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>
            {selectedDate ? `Details for ${selectedDate}` : "Select a date"}
          </Text>
          {selectedDate && (
            <View style={{ marginBottom: 16 }}>
              <TextInput
                style={styles.input}
                placeholder="Job Title"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Details"
                value={newDetails}
                onChangeText={setNewDetails}
              />
              <TextInput
                style={styles.input}
                placeholder="Time (e.g. 14:00)"
                value={newTime}
                onChangeText={setNewTime}
              />
              <TextInput
                style={styles.input}
                placeholder="Duration (e.g. 2h or 1d)"
                value={newDuration}
                onChangeText={setNewDuration}
              />
              <Button title="Add Detail" onPress={handleAddDetail} />
            </View>
          )}
          {jobsForDate.length > 0 ? (
            <FlatList
              data={jobsForDate}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.jobCard,
                    item.completed ? styles.completedCard : styles.incompleteCard,
                  ]}
                >
                  {editId === item.id ? (
                    <View style={styles.editForm}>
                      <TextInput
                        style={styles.input}
                        placeholder="Job Title"
                        value={editTitle}
                        onChangeText={setEditTitle}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Details"
                        value={editDetails}
                        onChangeText={setEditDetails}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Time (e.g. 14:00)"
                        value={editTime}
                        onChangeText={setEditTime}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Duration (e.g. 2h or 1d)"
                        value={editDuration}
                        onChangeText={setEditDuration}
                      />
                      <View style={styles.rowBetween}>
                        <Text style={styles.saveBtn} onPress={handleEditSave}>💾 Save</Text>
                        <Text style={styles.cancelBtn} onPress={handleEditCancel}>✖ Cancel</Text>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={styles.rowBetween}>
                        <Text style={styles.jobTitle}>{item.title}</Text>
                        <View style={styles.iconRow}>
                          <Text
                            style={item.completed ? styles.tickGreen : styles.tickRed}
                            onPress={() => handleToggleComplete(item.id)}
                          >
                            {item.completed ? "✔" : "✗"}
                          </Text>
                          <Text style={styles.editIcon} onPress={() => handleEditStart(item)}>📝</Text>
                          <Text style={styles.deleteIcon} onPress={() => handleDelete(item.id)}>🗑️</Text>
                        </View>
                      </View>
                      <Text style={styles.jobDeadline}>Deadline: {item.deadline}</Text>
                      <Text style={styles.jobDetails}>{item.details}</Text>
                      <Text style={styles.jobTime}>Time Range: {getTimeRange(item.time, item.duration)}</Text>
                      <Text style={styles.jobDuration}>Duration: {item.duration || "-"}</Text>
                    </>
                  )}
                </View>
              )}
            />
          ) : (
            <Text style={styles.noJobs}>No job deadlines for this date.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  calendar: {
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
  },
  detailsContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  jobCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 20,
    marginLeft: 10,
    color: "#1976D2",
    padding: 2,
  },
  deleteIcon: {
    fontSize: 20,
    marginLeft: 10,
    color: "#f44336",
    padding: 2,
  },
  editForm: {
    backgroundColor: "#fffbe7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ffd54f",
  },
  saveBtn: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 16,
    padding: 4,
  },
  cancelBtn: {
    color: "#f44336",
    fontWeight: "bold",
    fontSize: 16,
    padding: 4,
  },
  completedCard: {
    backgroundColor: "#e0f7e9",
    borderColor: "#4caf50",
    borderWidth: 1,
  },
  incompleteCard: {
    backgroundColor: "#fdecea",
    borderColor: "#f44336",
    borderWidth: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tickGreen: {
    color: "#4caf50",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 8,
    padding: 2,
  },
  tickRed: {
    color: "#f44336",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 8,
    padding: 2,
  },
  jobTime: {
    fontSize: 13,
    color: "#1976D2",
    marginTop: 2,
  },
  jobDuration: {
    fontSize: 13,
    color: "#1976D2",
    marginTop: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  jobDeadline: {
    fontSize: 14,
    color: "#1976D2",
  },
  jobDetails: {
    fontSize: 13,
    color: "#333",
  },
  noJobs: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
});
