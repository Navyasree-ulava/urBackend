import { useQuery } from '@tanstack/react-query';
import { dataApi } from '../lib/api';
import PostCard from '../components/post/PostCard';

export default function Explore() {
  // Fetch all posts (trending/explore feed)
  const { data: posts, isLoading } = useQuery({
    queryKey: ['explore-posts'],
    queryFn: async () => {
      const response = await dataApi.getPosts({
        sort: 'likesCount:-1',
        limit: 50,
      });
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="p-4">
          <h1 className="text-xl font-bold">Explore</h1>
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No posts to explore</p>
        </div>
      ) : (
        posts?.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}
