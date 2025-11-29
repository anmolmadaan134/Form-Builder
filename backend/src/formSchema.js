export const employeeOnboardingSchema = {
  title: "Employee Onboarding",
  description: "Employee onboarding details for HR.",
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      validations: {
        required: true,
        minLength: 3,
        maxLength: 100
      }
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter age",
      validations: {
        required: true,
        min: 18,
        max: 70
      }
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Select role",
      options: [
        { label: "Frontend Engineer", value: "frontend" },
        { label: "Backend Engineer", value: "backend" },
        { label: "Fullstack Engineer", value: "fullstack" }
      ],
      validations: {
        required: true
      }
    },
    {
      name: "skills",
      label: "Skills",
      type: "multi-select",
      placeholder: "Select skills",
      options: [
        { label: "React", value: "react" },
        { label: "Node.js", value: "node" },
        { label: "SQL", value: "sql" },
        { label: "DevOps", value: "devops" }
      ],
      validations: {
        minSelected: 1,
        maxSelected: 3
      }
    },
    {
      name: "joiningDate",
      label: "Joining Date",
      type: "date",
      placeholder: "Select joining date",
      validations: {
        required: true,
        minDate: "2020-01-01"
      }
    },
    {
      name: "bio",
      label: "About / Bio",
      type: "textarea",
      placeholder: "Short introduction",
      validations: {
        maxLength: 500
      }
    },
    {
      name: "isRemote",
      label: "Remote Employee",
      type: "switch",
      validations: {}
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "name@example.com",
      validations: {
        required: true,
        regex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      }
    }
  ]
};
