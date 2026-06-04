/**
 * Form component for adding/editing expenses
 */

import React, { useState, useEffect, useCallback } from "react";
import { ExpenseFormData } from "../types";
import { TextField, SelectBox, Button } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { fetchCategories } from "../services/api";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  refreshCategories?: number;
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

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
  refreshCategories = 0,
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories, refreshCategories]);

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />
      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />
      <SelectBox
        label="Category"
        options={
          categoriesLoading
            ? [{ value: "", label: "Loading..." }]
            : categoryOptions
        }
        value={formData.category}
        onChange={(e) => handleChange("category", e.target.value)}
        error={errors.category}
        fullWidth
        required
      />
      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />
      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || categoriesLoading}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
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
