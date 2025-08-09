import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value.trim());
  };

  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search posts"
        onChange={handleSearchChange}
      />
    </>
  );
}
