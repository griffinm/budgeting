import './styles.css';

export function Loading() {
  return (
    <div className="flex items-center flex-col justify-center mt-[100px] h-[250px]">
      <div className="mb-5">
        <img src='/assets/logo/logo-small.png' alt="logo" />
      </div>
      <div className="loader" />
    </div>
  )
}
