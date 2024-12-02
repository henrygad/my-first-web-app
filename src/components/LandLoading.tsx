
const LandLoading = ({loading}: {loading: boolean}) => {

  return <span className={!loading ? '' : 'block text-center h-6 border cursor-pointer '}>
  {!loading ? null : 'loading...'}
</span>
}

export default LandLoading;
