import * as z from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter your full name",
  }),
  nickname: z.string().min(1, {
    message: "Please enter your nickname",
  }),
  date_of_birth: z.date({
    required_error: "Please enter your date of birth",
    invalid_type_error: "Please enter a valid date of birth",
  }),
  gender: z.string().min(1, {
    message: "Please enter your gender",
  }), // Added missing comma
  weight: z.number().positive({
    message: "Please enter a valid weight",
  }),
  height: z.number().positive({
    message: "Please enter a valid height",
  }),
  physical_activity_level: z.string().min(1, {
    message: "Please choose a physical activity level",
  }),
});
