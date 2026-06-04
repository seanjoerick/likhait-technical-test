import React, { useState, useCallback } from "react";
import { TextField, Button, Alert } from "../vibes";

interface CategoryFormProps {
  onSubmit: (name: string) => Promise<void>;
  onCancel?: () => void;
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.5rem",
};

export function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        setError("Category name is required");
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        await onSubmit(name.trim());
        setSuccess(true);
        setName("");
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to create category. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {success && (
        <Alert type="success">✅ Category created successfully!</Alert>
      )}

      {error && <Alert type="error">{error}</Alert>}

      <TextField
        label="Category Name"
        type="text"
        placeholder="Enter category name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError(null);
        }}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Creating..." : "Add Category"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
