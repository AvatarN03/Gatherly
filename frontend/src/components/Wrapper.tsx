type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="max-w-480 mx-auto px-2 md:px-4">
      {children}
    </div>
  );
};

export default Wrapper;