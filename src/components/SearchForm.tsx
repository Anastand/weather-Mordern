import React from "react";
interface SearchFormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}
function SearchForm({ onSubmit, children }: SearchFormProps) {
  return <form onSubmit={onSubmit}>{children}</form>;
}

export default SearchForm;
