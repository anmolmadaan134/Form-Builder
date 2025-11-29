import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFormSchema, submitForm } from "../api.js";
import FormRenderer from "../components/FormRenderer.jsx";

export default function DynamicFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: schema, isLoading, isError } = useQuery({
    queryKey: ["form-schema"],
    queryFn: fetchFormSchema
  });

  const mutation = useMutation({
    mutationFn: submitForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      navigate("/submissions");
    }
  });

  if (isLoading) {
    return <div>Loading form schema...</div>;
  }

  if (isError || !schema) {
    return <div className="text-red-500">Error loading form schema.</div>;
  }

  return (

      <div className="card shadow rounded-lg p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">{schema.title}</h2>
        <p className="text-sm text-slate-500">{schema.description}</p>
      </div>
    <FormRenderer
      schema={schema}
      isSubmitting={mutation.isPending}
      onSubmit={async (values) => {
        try {
          const res = await mutation.mutateAsync(values);
          if (!res.success && res.errors) {
            return { success: false, errors: res.errors };
          }
          return { success: true };
        } catch (e) {
          if (e.response?.data?.errors) {
            return { success: false, errors: e.response.data.errors };
          }
          return { success: false, errors: { _global: "Unexpected error" } };
        }
      }}
    />
    </div>
  );
}
