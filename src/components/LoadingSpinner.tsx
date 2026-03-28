export default function LoadingSpinner() {
	return (
		<>
			<style>
				{`
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid;
  border-color: currentColor #0000;
  animation: l1 1s infinite;
}
@keyframes l1 {to{transform: rotate(.5turn)}}
			`}
			</style>
			<div className="loader text-primary" role="status"></div>
		</>
	);
}
