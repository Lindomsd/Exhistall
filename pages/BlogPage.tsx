import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Icon } from '../components/Icon';
import { mockBlogPosts } from '../data/mockData';
import type { BlogPost } from '../types';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden group">
    <img className="h-48 w-full object-cover" src={post.imageUrl} alt={post.title} />
    <div className="p-6">
      <p className="text-sm text-brand-secondary dark:text-slate-400">{post.date} &bull; by {post.author}</p>
      <h3 className="mt-2 text-xl font-bold text-brand-dark dark:text-white">{post.title}</h3>
      <p className="mt-2 text-brand-secondary dark:text-slate-300">{post.excerpt}</p>
      <button className="mt-4 font-semibold text-brand-blue dark:text-brand-gold flex items-center gap-2 group-hover:gap-3 transition-all">
        Read More <Icon name="arrow-right" className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="bg-brand-light dark:bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold">The Exhistalls Blog</h1>
            <p className="mt-2 text-lg text-brand-secondary dark:text-slate-400">Insights, tips, and stories for our small business community.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBlogPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
};

export default BlogPage;
