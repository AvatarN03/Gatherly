type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="max-w-480 mx-auto">
      {children}
    </div>
  );
};

export default Wrapper;