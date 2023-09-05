import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";
import {
  fetchUser,
  fetchUserPosts,
  getUserReplies,
} from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import ThreadsTab from "@/components/shared/ThreadsTab";
import LeaveButton from "@/components/shared/LeaveButton";
import CommunityCard from "@/components/cards/CommunityCard";
import { userCommunity } from "@/lib/actions/community.action";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const userReplies = await getUserReplies(userInfo._id);
  const totalParentThreads = await fetchUserPosts(userInfo.id);
  const userCommunityFind = await userCommunity(userInfo._id);

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.userName}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} />
                <p className="max-sm:hidden text-gray-400">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm text-white bg-gray-500 px-2 py-1">
                    {totalParentThreads?.threads?.length}
                  </p>
                )}
                {tab.label === "Replies" && (
                  <p className="ml-1 rounded-sm text-white bg-gray-500 px-2 py-1">
                    {userReplies?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full"
            >
              {tab.value === "threads" && (
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType="User"
                />
              )}
              {tab.value === "replies" && (
                <>
                  {userReplies.length === 0 && (
                    <section>
                      <h1 className="head-text text-center text-gray-600">
                        {userInfo?.name} don't make any reply to anyone.
                      </h1>
                    </section>
                  )}
                  {userReplies.map((tab: any) => (
                    <div key={`reply-${tab._id}`} className="w-full relative">
                      <Link href={`/thread/${tab.parentId}`}>
                        <span className="text-sm z-4 bg-slate-900/80 text-gray-500 hover:text-gray-300 transition hover:bg-slate-800 p-2 rounded-lg absolute right-2 bottom-3 flex items-center">
                          <FiExternalLink size={20} />
                          Original Thread
                        </span>
                      </Link>
                      <ThreadCard
                        key={tab._id}
                        id={tab.id}
                        currentUserId={userInfo._id || ""}
                        parentId={tab.parentId}
                        content={tab.text}
                        author={tab.author}
                        community={tab.community}
                        createdAt={tab.createdAt}
                        comments={tab.children}
                        image={tab.image}
                        likes={tab.likes}
                      />
                    </div>
                  ))}
                </>
              )}
              {tab.value === "community" && (
                <>
                  <div>
                    {userCommunityFind && (
                      <>
                      <h1 className="head-text text-center text-gray-600">
                      Community Created by {userInfo.name}
                    </h1>
                      {/* <section className="mt-9 flex flex-wrap gap-4"> */}
                      <section className="mt-2 grid grid-cols-2 sm:grid-cols-1 gap-3">
                        {userCommunityFind.map((community: any) => (
                          <div key={community.id}>
                            <CommunityCard
                              id={community.id}
                              name={community.name}
                              username={community.username}
                              imgUrl={community.image}
                              bio={community.bio}
                              members={community.members}
                              />
                          </div>
                        ))}
                      </section>
                        </>
                    )}
                  </div>
                  {userInfo.communities.length === 0 ? (
                    <section className="flex justify-center flex-col gap-3 h-28 mt-10  items-center">
                      <h1 className="head-text text-center text-gray-600">
                        Currently!! you are not a member of any Community
                      </h1>
                      <Link
                        href={"/communities"}
                        className="bg-blue-500 hover:bg-blue-700 p-2  rounded-lg shadow-lg"
                      >
                        Join any
                      </Link>
                    </section>
                  ) : (
                    <> <h1 className="head-text mt-5 text-gray-600 text-center">
                    Community in which {userInfo.name} is member</h1>
                    {userInfo.communities.map((activity: any) => (
                      <Link
                        key={activity.id}
                        href={`/communities/${activity._id}`}
                      >
                        <article className="activity-card justify-between mt-2">
                            <div className="flex gap-3">
                              <Image
                                src={activity.image}
                                alt="Profile Photo"
                                width={30}
                                height={30}
                                className="rounded-full object-contain"
                              />
                              <p className="text-lg">
                                <span className="text-blue-500">
                                  {activity.name}
                                </span>
                              </p>
                            </div>
                            <LeaveButton
                              id={activity._id}
                              members={userInfo._id}
                            />
                          </article>
                        </Link>
                      ))}
                    </>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
