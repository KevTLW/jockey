interface BrandProps {
  accent: string;
  primary: string;
}

export const Brand = ({ accent, primary }: BrandProps) => {
  return (
    <>
      <span className={`${primary} [font-variant:small-caps]`}>j</span>
      <span className={accent}>o</span>
      <span className={primary}>ckey</span>
    </>
  );
};

export default Brand;
