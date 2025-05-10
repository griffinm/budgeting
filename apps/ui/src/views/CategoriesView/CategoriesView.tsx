import { PageHeader } from "@budgeting/ui/components/PageHeader";
import { useEffect, useState } from "react";
import { fetchCategories, fetchSpend } from "@budgeting/ui/utils/api";
import { MerchantCategoryEntity } from "@budgeting/api/merchant-category/dto/merchant-category.entity";
import { LoadingSpinner } from "@budgeting/ui/components/Loading";
import { CategoriesTable } from "./CategoriesTable";
import { SpendSummaryDto } from "@budgeting/api/Spend/dto/spend-summary.dto";
import { SpendSummaryDisplay } from "./SpendSummaryDisplay";

export function CategoriesView() {
  const [categories, setCategories] = useState<MerchantCategoryEntity[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<MerchantCategoryEntity[]>([]);
  const [spendSummary, setSpendSummary] = useState<SpendSummaryDto | null>(null);
  const [spendSummaryLoading, setSpendSummaryLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  useEffect(() => {
    setCategoriesLoading(true);
    fetchCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => console.error(error))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSpendSummary(null);
      return;
    }

    setSpendSummaryLoading(true);
    
    const params = { 
      categoryIds: selectedCategories.map((c) => c.id),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };
    
    fetchSpend(params)
      .then((response) => setSpendSummary(response.data))
      .finally(() => setSpendSummaryLoading(false));
  }, [selectedCategories, startDate, endDate]);
  
  const handleSelectCategory = (category: MerchantCategoryEntity) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  }
  
  const handleDateFilterChange = (newStartDate: string | null, newEndDate: string | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }

  return (
    <div>
      <PageHeader title="Categories" />

      {categoriesLoading ? (
        <LoadingSpinner />
      ) : (
        <CategoriesTable
          categories={categories}
          onSelectCategory={handleSelectCategory}
          selectedCategories={selectedCategories}
        />
      )}
      
      <SpendSummaryDisplay 
        spendSummary={spendSummary} 
        loading={spendSummaryLoading}
        onFilterChange={handleDateFilterChange}
      />
    </div>
  );
}
