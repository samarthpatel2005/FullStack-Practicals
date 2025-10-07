import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
  },
  companyName: {
    type: String,
    required: [true, "Please provide a company name."],
  },
  description: {
    type: String,
    required: [true, "Please provide decription."],
    minLength: [30, "Description must contain at least 30 Characters!"],
    maxLength: [500, "Description cannot exceed 500 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
    minLength: [20, "Location must contian at least 20 characters!"],
  },
  skills: {
    type: [String],
    required: [true, "Please provide required skills."],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "At least one skill is required!"
    }
  },
  fixedSalary: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  salaryFrom: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  salaryTo: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobType: {
    type: String,
    enum: ["Full Time", "Part Time"],
    required: [true, "Please select job type (Full Time or Part Time)."],
  },
  duration: {
    start: { type: String },
    end: { type: String },
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  shortlisted: [
    {
      jobSeeker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
    }
  ],
});

export const Job = mongoose.model("Job", jobSchema); 