import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface CollapsibleCacheElementArgs {
    tokenId : string;
    title : string;
    author : string;
    unlocked: boolean;
    quantity : number;
    isOwn : boolean;
    unlockAction : Function;
}

export default class CollapsibleCacheElement extends Component<CollapsibleCacheElementArgs> {
    @service walletConnect;
    @tracked entries = null;
    @tracked collapsed = true;


    async loadUnlockedCacheEntries()
    {
        if(this.entries != null || !this.args.unlocked) return;
        this.entries = await this.walletConnect.getUnlockedCacheEntries(this.args.tokenId);
    }

    toggleCollapsible()
    {
        this.collapsed = !this.collapsed;
    }

    async reloadCacheEntries()
    {
        this.entries = null;
        await this.loadUnlockedCacheEntries();
    }

    @action async unlockOrViewCache()
    {
        if(this.args.unlocked) 
        {
            await this.loadUnlockedCacheEntries();
            this.toggleCollapsible();
        }
        else
        {
            this.args.unlockAction();
        }
    }

}
